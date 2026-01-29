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
  images: {
    url_image: string
  }[]
  review: ReportReview | null
}

export interface ReportReview {
  id_review: number
  comment: string
  user: {
    firstname: string
    lastname: string
  }
  images: {
    id_image: number
    url_image: string
  }[]
}
