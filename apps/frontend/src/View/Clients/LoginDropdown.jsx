import { Menu, Text } from "@mantine/core";
import { TwitchLogo, DiscordLogo, SignOut } from "phosphor-react";
import { useUserAuth } from "../../Context/AuthContext";

export const LoginDropDown = () => {
  const isLog = localStorage.getItem("userId");
  const { signIn, signOut } = useUserAuth();
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
            <Menu.Item onClick={signIn("twitch")}>
              <TwitchLogo size={32} />
            </Menu.Item>
            <Menu.Item onClick={signIn("discord")}>
              <DiscordLogo size={32} />
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
