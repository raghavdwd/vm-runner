export type VMAction = "start" | "stop" | "restart";

export interface VMStatusResponse {
  state?: string;
  status?: string;
  data?: {
    status?: string;
    state?: string;
  };
}

export interface VMActionRequest {
  vm_id: string | number;
}
