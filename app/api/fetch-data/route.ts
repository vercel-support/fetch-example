export async function GET() {
  console.log("[v0] === SERVER-SIDE FETCH STARTED ===")
  console.log("[v0] Request time:", new Date().toISOString())

  const url = "https://api.aistudio.dropshot.io/v1/template"
  console.log("[v0] Target URL:", url)

  try {
    console.log("[v0] Initiating fetch request...")
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
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
      return Response.json(
        { error: `HTTP ${res.status}: ${res.statusText}`, details: errorBody },
        { status: res.status },
      )
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

    console.log("[v0] === FETCH COMPLETED SUCCESSFULLY ===")
    return Response.json(data)
  } catch (err) {
    console.error("[v0] === FETCH ERROR ===")
    console.error("[v0] Error Type:", err instanceof Error ? err.constructor.name : typeof err)
    console.error("[v0] Error Message:", err instanceof Error ? err.message : String(err))
    console.error("[v0] Error Stack:", err instanceof Error ? err.stack : "N/A")
    console.error("[v0] Full Error Object:", err)

    return Response.json({ error: err instanceof Error ? err.message : "Failed to fetch data" }, { status: 500 })
  }
}
