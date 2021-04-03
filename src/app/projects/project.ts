export interface Project {
    id: string;
    name: string;
}

export interface ProjectDetail extends Project {
    objectives?: Objective[];
}

export interface Objective {
    id: string;
    name: string;
    description?: string;
    campaigns?: Campaign[]
}

export interface Campaign {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    channels?: Channel[]
}

export interface Channel {
    id: string;
    name: string;
    kpis?: KPI[]
}

export interface KPI {
    id: string;
    name: string;
}