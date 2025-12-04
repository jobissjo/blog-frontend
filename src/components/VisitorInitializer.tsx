"use client";

import { useEffect } from "react";
import { visitorService } from "@/services/visitorService";

export default function VisitorInitializer() {
    useEffect(() => {
        visitorService.ensureVisitorId();
    }, []);

    return null;
}
