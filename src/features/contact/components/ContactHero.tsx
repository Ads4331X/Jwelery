import { Box } from "@mui/material";

import { PageHero } from "../../../components/shared/hero/PageHero";

export function ContactHero() {
  return (
    <PageHero
      label="Anand Jewellers"
      title={
        <>
          Contact{" "}
          <Box component="span" className="italic text-amber-700">
            Us
          </Box>
        </>
      }
      subtitle="Experience the craft of fine jewelry. Our artisans are available for bespoke consultations, private viewings, and heritage inquiries."
    />
  );
}
