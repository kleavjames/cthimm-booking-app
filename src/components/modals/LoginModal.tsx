import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { Label as FormLabel } from "@/components/ui/label";
import supabase from "@/config/supabase";
import { DialogDescription } from "@radix-ui/react-dialog";
import useAuthStore from "@/store/authStore";

type LoginModalProps = {
  //
};

export const LoginModal: FC<LoginModalProps> = () => {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      console.error("Error logging in:", error.message);
      return;
    }

    if (data) {
      setAuthUser(data.session);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Only administrators can login</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-7 py-4">
          <div className="flex flex-col gap-5">
            <div className="grid w-full max-w-sm items-center gap-2">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-2">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={onLogin}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
