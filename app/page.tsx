"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FetchExample() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("/api/fetch-data")
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch data")
      }

      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Fetch API Example</CardTitle>
          <CardDescription>Fetch data from api.aistudio.dropshot.io/v1/template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchData} disabled={loading} className="w-full">
            {loading ? "Fetching..." : "Fetch Data"}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-destructive font-medium">Error:</p>
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Response:</p>
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
