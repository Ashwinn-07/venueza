export class VenueCreateRequestDto {
  name!: string;
  address!: string;
  location!: {
    type: "Point";
    coordinates: number[];
  };
  capacity!: number;
  price!: number;
  services?: string[];
  images?: string[];
}

export class VenueUpdateRequestDto {
  name?: string;
  address?: string;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  capacity?: number;
  price?: number;
  services?: string[];
  images?: string[];
  documents?: string[];
  status?: "open" | "closed";
}

export class VenueResponseDto {
  id!: string;
  vendor!: string;
  name!: string;
  address!: string;
  location!: {
    type: "Point";
    coordinates: number[];
  };
  capacity!: number;
  price!: number;
  images!: string[];
  services!: string[];
  documents!: string[];
  status!: "open" | "closed";
  verificationStatus!: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export class VenueListResponseDto {
  venues!: VenueResponseDto[];
  totalCount!: number;
  message!: string;
}
