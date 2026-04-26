import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { instanceUrl, accessToken, apiVersion } = await request.json();

    if (!instanceUrl || !accessToken || !apiVersion) {
      return NextResponse.json(
        { error: "Missing required fields: instanceUrl, accessToken, apiVersion" },
        { status: 400 }
      );
    }

    // Query Salesforce for IDP configurations
    // Using SOQL to query the DocumentAIConfig object
    const query = "SELECT Id, Name, DeveloperName FROM DocumentAIConfig WHERE IsActive = true LIMIT 100";
    const encodedQuery = encodeURIComponent(query);

    const url = `${instanceUrl}/services/data/${apiVersion}/query?q=${encodedQuery}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // If the query fails (maybe object doesn't exist or no permissions), return empty array
      console.warn("Could not fetch IDP configs:", response.status, await response.text());
      return NextResponse.json({ configs: [] });
    }

    const data = await response.json();
    const configs = data.records?.map((record: { DeveloperName?: string; Name?: string }) =>
      record.DeveloperName || record.Name
    ).filter(Boolean) || [];

    return NextResponse.json({ configs });
  } catch (error) {
    console.error("Error fetching IDP configs:", error);
    return NextResponse.json({ configs: [] });
  }
}
