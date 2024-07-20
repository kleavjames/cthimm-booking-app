import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { LoginModal } from "./modals/LoginModal";
import { Button } from "./ui/button";
import supabase from "@/config/supabase";
import useAuthStore from "@/store/authStore";

export const Header = () => {
  const token = useAuthStore((state) => state.token);
  const clearAuthUser = useAuthStore((state) => state.clearAuthUser);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }

    clearAuthUser();
  };

  return (
    <>
      <div className="flex flex-row items-center mx-10">
        <h1 className="font-bold">CTHIMM Booking</h1>
        <NavigationMenu className="my-3 ml-auto">
          <NavigationMenuList>
            {!token && (
              <NavigationMenuItem>
                <NavigationMenuLink>
                  <LoginModal />
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {token && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Welcome, Admin</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>
                    <Button variant="ghost" onClick={logout}>
                      Logout
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator />
    </>
  );
};
