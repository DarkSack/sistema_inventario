import { Menu, Text } from "@mantine/core";
import { TwitchLogo, DiscordLogo, SignOut } from "phosphor-react";
import { useUserAuth } from "../Context/AuthContext";

export const LoginDropDown = () => {
  const isLog = localStorage.getItem("userId");
  const { signInWithDiscord, signInWithTwitch, signOut } = useUserAuth();
  const title = isLog ? "Cerrar sesión" : "Iniciar sesión";
  return (
    <Menu transitionProps={{ transition: "fade-down", duration: 100 }}>
      <Menu.Target>
        <Text size="sm" className="cursor-pointer">{title}</Text>
      </Menu.Target>
      <Menu.Dropdown>
        {isLog ? (
          <Menu.Item onClick={signOut}>
            <SignOut size={32} />
          </Menu.Item>
        ) : (
          <>
            <Menu.Item onClick={signInWithTwitch}>
              <TwitchLogo size={32} />
            </Menu.Item>
            <Menu.Item onClick={signInWithDiscord}>
              <DiscordLogo size={32} />
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
