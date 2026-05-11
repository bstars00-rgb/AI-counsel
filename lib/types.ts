export type BookingProbability = "High" | "Medium" | "Low";

export interface CustomerAnswer {
  summary: string;
  recommendation_direction: string;
  suggested_itinerary_or_style: string;
  estimated_budget_range: string;
  advantages: string[];
  cautions: string[];
  next_message_to_customer: string;
}

export interface StaffSummary {
  destination_interest: string;
  travel_type: string;
  travelers: string;
  duration: string;
  budget_hint: string;
  key_needs: string[];
  missing_information: string[];
  booking_probability: BookingProbability;
  recommended_consulting_direction: string;
}

export interface ConsultResponse {
  customer_question: string;
  customer_answer: CustomerAnswer;
  staff_summary: StaffSummary;
  staff_questions: string[];
  staff_opening_script: string;
}

export interface ConsultHistoryItem {
  id: string;
  createdAt: string;
  question: string;
  response: ConsultResponse;
  note?: string;
}
