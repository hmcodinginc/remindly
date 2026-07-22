import { useState } from "react"
import { FileText, Upload, Trash2, Download, FileCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface DocItem {
  id: string
  name: string
  service: string
  size: string
  date: string
}

export function DocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>([
    { id: "doc-1", name: "AWS_Invoice_July_2026.pdf", service: "AWS Cloud", size: "245 KB", date: "2026-07-01" },
    { id: "doc-2", name: "Figma_Organization_Receipt.pdf", service: "Figma", size: "118 KB", date: "2026-06-15" },
  ])

  const handleUpload = () => {
    const name = prompt("Enter document title:")
    if (!name) return
    const newDoc: DocItem = {
      id: "doc-" + Date.now(),
      name: name.endsWith(".pdf") ? name : `${name}.pdf`,
      service: "General Invoice",
      size: "150 KB",
      date: new Date().toISOString().split("T")[0],
    }
    setDocs([newDoc, ...docs])
    toast.success(`Document "${newDoc.name}" uploaded successfully!`)
  }

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id))
    toast.success("Document deleted")
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Documents & Receipts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Store invoices, licenses, and receipts associated with your subscriptions.
          </p>
        </div>
        <Button className="gap-2" onClick={handleUpload}>
          <Upload className="size-4" />
          <span>Upload Document</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                <FileText className="size-5" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
                <p className="text-xs text-muted-foreground">{doc.service} • {doc.size}</p>
                <p className="text-[11px] text-muted-foreground/70">Uploaded on {doc.date}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary" onClick={() => toast.info("Simulating PDF download...")}>
                <Download className="size-3.5" />
                <span>Download</span>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(doc.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
