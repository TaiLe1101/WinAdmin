import { ROUTES } from "@/configs/routes";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import Admin from "@/pages/Admin/Admin";
import CreateVPCSLink from "@/pages/CreateVPCSLink/CreateVPCSLink";
import Home from "@/pages/Home/Home";
import VPCSLink from "@/pages/VPCSLink/VPCSLink";
import { PublicRouter } from "@/types/types";

export const publicRouter: PublicRouter[] = [
  {
    path: ROUTES.HOME,
    component: Home,
  },
  {
    path: ROUTES.ADMIN,
    component: Admin,
    layout: AdminLayout,
  },
  {
    path: ROUTES.VPCS_LINK,
    component: VPCSLink,
    layout: AdminLayout,
  },
  {
    path: ROUTES.CREATE_VPCS_LINK,
    component: CreateVPCSLink,
    layout: AdminLayout,
  },
];
