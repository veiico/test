// export interface IFeature {
//   heading: string,
//   description: string,
//   image: string
// }



export interface IFeature {

  features: Array<IFeaColumn[]>,
  
}
interface IFeaColumn {
    heading: string,
  description: string,
  image: string
}
