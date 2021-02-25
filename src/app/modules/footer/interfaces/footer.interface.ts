export interface IFooterData {
  logo: string,
  logo_redirect_url: string,
  columns: Array<IFooterColumn[]>,
  socialLinks: ISocialLinks[],
  copyright: string
}
interface IFooterColumn {
  label: string,
  url: string
}
interface ISocialLinks {
  image: string,
  text: string,
  url: string
}