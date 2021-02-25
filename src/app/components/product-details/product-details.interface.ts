
export interface IMerchantProfile {
addres:  string;
banner_image: string;
city_id: number;
country_id: number;
creation_datetime: string;
description: string;
display_address: string;
display_name: string;
email: string;
email_verification_token: string;
id: number;
is_active: number;
is_blocked: number;
is_review_rating_enabled: number;
last_review_rating: Array<ILastReviewRating>;
latitude: number;
logo: string;
longitude: number;
new_email: string;
open_close_busy: number;
partial_open_close_text: string;
phone: string;
schedule_type: number;
serving_distance: number;
state_id: number;
store_name: number;
store_rating: number;
tookan_team_id: number;
total_ratings_count: number;
total_ratings_sum: number;
total_review_count: number;
update_datetime: string;
user_id: number;
}

export class ILastReviewRating {
  rating: number;
  review: string;
  customer_name: string;
}
