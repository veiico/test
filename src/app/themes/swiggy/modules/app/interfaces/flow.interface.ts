// export interface IFlow {
//   heading: string,
//   description: string,
//   image: string
// }

export interface IFlow {
  flow: Array<IFlowColumn[]>,
  title:any
}
interface IFlowColumn {
  heading: string,
  description: string,
  image: string
}
