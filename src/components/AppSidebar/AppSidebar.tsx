import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { CollapsibleContent } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/configs/routes";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";

// Define types for sidebar items
interface SidebarChild {
  title: string;
  path: string;
}

interface SidebarItem {
  title: string;
  child: SidebarChild[];
}

// Define SIDEBARS_ITEMS with the appropriate type
const SIDEBARS_ITEMS: SidebarItem[] = [
  {
    title: "main",
    child: [
      {
        title: "Dashboard",
        path: ROUTES.ADMIN,
      },
    ],
  },
  {
    title: "FEATURE",
    child: [
      {
        title: "VPCS Link",
        path: ROUTES.VPCS_LINK,
      },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation(); // Get the current location
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Toggle the open state of a section
  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Helper function to check if any child item is active
  const isAnyChildActive = (nav: SidebarItem): boolean => {
    return nav.child.some((navChild) => location.pathname === navChild.path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        {SIDEBARS_ITEMS.map((nav, index) => {
          // Determine if the section should be open
          const isOpen = openSections[nav.title] || isAnyChildActive(nav);
          return (
            <Collapsible
              key={index}
              title={nav.title}
              className="group/collapsible"
              open={isOpen} // Set open state based on the local state or active path
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger
                    className="uppercase"
                    onClick={() => toggleSection(nav.title)}
                  >
                    {nav.title}
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {nav.child.map((navChild) => {
                        // Check if the path matches the current route
                        const isActive = location.pathname === navChild.path;
                        return (
                          <SidebarMenuItem key={navChild.title}>
                            <SidebarMenuButton asChild isActive={isActive}>
                              <a href={navChild.path}>{navChild.title}</a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
