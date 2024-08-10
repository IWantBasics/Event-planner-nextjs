export interface Event {
    id: number;
    name: string;
    date: string;
    description: string;
    location: string;
    fullname: string; 
    created_by: string;
    attendees: { id: number; name: string }[]; 
    attendee_count?: number;
    messages?: { id: number; userId: number; message: string; timestamp: string }[]; 
}
