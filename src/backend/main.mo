// main.mo
// Composition root — wires together all mixins.
// No business logic lives here; everything is delegated to mixins.

import ScheduleApi "mixins/schedule-api";

actor {
  // Include the schedule API mixin (no shared state needed for this domain)
  include ScheduleApi();
};
