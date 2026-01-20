export type VMAction = "start" | "stop" | "restart";

export interface VMStatusResponse {
  status?: string;
  data?: {
    status: string;
  };
}

export interface VMActionRequest {
  vm_id: string | number;
}
