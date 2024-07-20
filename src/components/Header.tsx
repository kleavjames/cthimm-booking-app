import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { LoginModal } from "./modals/LoginModal";
import useAuthStore from "@/store/authStore";
import { MainMenu } from "./MainMenu";

export const Header = () => {
  const token = useAuthStore((state) => state.token);

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

            {token && <MainMenu />}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator />
    </>
  );
};
