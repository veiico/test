export interface ITokenIntent {
  amount: number,
  brand: string,
  client_secret: string,
  company_name: string | null,
  currency_symbol: string,
  email: string,
  expiry_date: string,
  first_name: string,
  id: number,
  last4_digits: string,
  logo: string,
  name: string,
  payment_intent_id: string,
  payment_method: string
  user_id: number,
  card_token: string
}