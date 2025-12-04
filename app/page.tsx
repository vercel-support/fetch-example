import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 86400

async function fetchTemplateData() {
  console.log("[v0] === SERVER-SIDE ISR FETCH STARTED ===")
  console.log("[v0] Request time:", new Date().toISOString())
  console.log("[v0] Deployment Region: ICN1 (Seoul)")
  console.log("[v0] Revalidate interval: 86400 seconds (24 hours)")

  const url = "https://api.aistudio.dropshot.io/v1/template"
  console.log("[v0] Target URL:", url)

  try {
    console.log("[v0] Initiating fetch request...")
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // ISR cache configuration
    })

    console.log("[v0] === RESPONSE RECEIVED ===")
    console.log("[v0] Status Code:", res.status)
    console.log("[v0] Status Text:", res.statusText)
    console.log("[v0] OK:", res.ok)
    console.log("[v0] Response Type:", res.type)

    // Log all headers
    const headers: Record<string, string> = {}
    res.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.log("[v0] Response Headers:", JSON.stringify(headers, null, 2))

    if (!res.ok) {
      console.log("[v0] === HTTP ERROR RESPONSE ===")
      let errorBody = ""
      try {
        errorBody = await res.text()
        console.log("[v0] Error Response Body:", errorBody)
      } catch (e) {
        console.log("[v0] Could not read error body")
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    console.log("[v0] Attempting to parse JSON response...")
    const contentType = res.headers.get("content-type")
    console.log("[v0] Content-Type:", contentType)

    const data = await res.json()
    console.log("[v0] === PARSED DATA ===")
    console.log("[v0] Data:", JSON.stringify(data, null, 2))
    console.log("[v0] Data Type:", typeof data)
    console.log("[v0] Is Array:", Array.isArray(data))
    if (typeof data === "object" && data !== null) {
      console.log("[v0] Object Keys:", Object.keys(data))
    }

    console.log("[v0] === ISR FETCH COMPLETED SUCCESSFULLY ===")
    return data
  } catch (err) {
    console.error("[v0] === FETCH ERROR ===")
    console.error("[v0] Error Type:", err instanceof Error ? err.constructor.name : typeof err)
    console.error("[v0] Error Message:", err instanceof Error ? err.message : String(err))
    console.error("[v0] Error Stack:", err instanceof Error ? err.stack : "N/A")
    console.error("[v0] Full Error Object:", err)
    throw err
  }
}

export default async function FetchExample() {
  let response = null
  let error = null

  try {
    response = await fetchTemplateData()
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch data"
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>ISR Fetch API Example</CardTitle>
          <CardDescription>Data from api.aistudio.dropshot.io/v1/template (Revalidates every 24 hours)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-md text-sm space-y-1">
            <p>
              <span className="font-medium">Region:</span> ICN1 (Seoul)
            </p>
            <p>
              <span className="font-medium">Revalidation:</span> 86400 seconds (24 hours)
            </p>
            <p>
              <span className="font-medium">Last fetched:</span> {new Date().toISOString()}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-destructive font-medium">Error:</p>
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Response Data:</p>
              <pre className="p-4 bg-muted rounded-md overflow-auto max-h-96 text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
