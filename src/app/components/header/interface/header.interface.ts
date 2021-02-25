export interface IHeaderData {
    logo: string,
    logo_redirect_url: string,
    columns: Array<IHeaderColumn[]>,
    socialLinks: IHeaderSocialLinks[],
    copyright: string
  }
  interface IHeaderColumn {
    label: string,
    url: string
  }
  interface IHeaderSocialLinks {
    image: string,
    text: string,
    url: string
  }