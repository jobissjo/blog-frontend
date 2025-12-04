import apiClient from "@/lib/api";

const VISITOR_ID_KEY = "visitor_id";

export const visitorService = {
    getVisitorId: async (): Promise<string | null> => {
        if (typeof window === "undefined") return null;

        let visitorId = localStorage.getItem(VISITOR_ID_KEY);

        if (!visitorId) {
            try {
                const response = await apiClient.get<{ data: { visitor_id: string } }>(
                    "/api/visitor_id"
                );
                if (response.data?.data?.visitor_id) {
                    visitorId = response.data.data.visitor_id;
                    localStorage.setItem(VISITOR_ID_KEY, visitorId);
                }
            } catch (error) {
                console.error("Error fetching visitor ID:", error);
            }
        }

        return visitorId;
    },

    ensureVisitorId: async () => {
        await visitorService.getVisitorId();
    },

    getStoredVisitorId: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(VISITOR_ID_KEY);
    },
};
