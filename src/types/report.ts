export interface Report {
  id_report: number
  public_id: string
  folio: string
  title: string
  date: string
  categories: {
    category: string
  }
  user: {
    email: string
  }
  status: {
    status: string
  }
}
