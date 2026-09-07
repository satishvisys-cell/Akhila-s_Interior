import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Badge, LiveIndicator } from "@/components/ui/badge";
import { Input, Label, Textarea, Select } from "@/components/ui/form";
import {
  EmptyState,
  ErrorState,
  ProgressBar,
  Skeleton,
} from "@/components/ui/feedback";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Link } from "@/components/ui/link";

export const metadata = {
  title: "Design System",
};

/** Internal foundation checklist — not a marketing page. */
export default function DesignSystemPage() {
  return (
    <div className="canvas-sky pt-[var(--header-h)] font-editorial">
      <Section>
        <Container className="space-y-16">
          <Stack gap="md">
            <p className="label-caps text-text-muted">Foundation</p>
            <h1 className="text-h1">Design system primitives</h1>
            <p className="text-text-muted max-w-prose">
              Token-driven components extracted from Stitch. Use these — do not
              invent one-off styles on feature pages.
            </p>
          </Stack>

          <Stack gap="md">
            <h2 className="text-h2">Typography</h2>
            <p className="text-display">Display</p>
            <p className="text-h1">Heading one</p>
            <p className="text-h2">Heading two</p>
            <p className="text-h3">Heading three</p>
            <p>Body — Manrope for UI and long-form readability.</p>
            <p className="label-caps">Label caps / navigation</p>
          </Stack>

          <Stack gap="md">
            <h2 className="text-h2">Buttons</h2>
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="charcoal">Charcoal</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="bg-graphite p-6 flex flex-wrap gap-3">
              <Button variant="inverse">Inverse</Button>
            </div>
          </Stack>

          <Stack gap="md">
            <h2 className="text-h2">Badges & live</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge tone="live">LIVE</Badge>
              <Badge tone="offline">OFFLINE</Badge>
              <Badge tone="maintenance">MAINTENANCE</Badge>
              <LiveIndicator />
            </div>
          </Stack>

          <Stack gap="md">
            <h2 className="text-h2">Forms</h2>
            <div className="max-w-md space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="type">Project type</Label>
                <Select id="type" defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  <option>Residential</option>
                  <option>Commercial</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" placeholder="Tell us about the site" />
              </div>
            </div>
          </Stack>

          <Stack gap="md">
            <h2 className="text-h2">Feedback</h2>
            <ProgressBar value={65} label="Structure" />
            <Skeleton className="h-24 w-full" />
            <Grid cols={2}>
              <EmptyState
                title="No projects yet"
                description="Published projects will appear here."
                action={<Link href="/contact">Start a Project</Link>}
              />
              <ErrorState
                title="Stream unavailable"
                description="The camera is offline or unauthorized."
              />
            </Grid>
            <Breadcrumb
              items={[
                { href: "/live-sites", label: "Live Sites" },
                { label: "Skyline Villa" },
              ]}
            />
          </Stack>
        </Container>
      </Section>
    </div>
  );
}
