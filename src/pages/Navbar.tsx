import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="flex justify-between items-center bg-amber-600 text-white">
      <h1 className="ms-4">Sample Project</h1>
      <NavigationMenu className="p-4">
        <NavigationMenuList className="flex gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-lg font-medium">
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
