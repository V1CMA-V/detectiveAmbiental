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
  public_id: string
  comment: string
  id_report: number
  id_user: number
  user: {
    firstname: string
    lastname: string
  }
  reviewImages: {
    id_image: number
    url: string
  }[]
}
