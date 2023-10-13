import { useRouter, useSearchParams } from "next/navigation";
import { create } from "zustand";

import { useFetch } from "_helpers/client";
import { useAlertService } from "_services";

export { useUserService };

// user state store
const initialState = {
  users: undefined,
  user: undefined,
  currentUser: undefined,
};
const userStore = create<IUserStore>(() => initialState);

function useUserService(): IUserService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { users, user, currentUser } = userStore();

  return {
    users,
    user,
    currentUser,
    login: async (username, password) => {
      alertService.clear();
      try {
        const currentUser = await fetch.post("/api/account/login", {
          username,
          password,
        });
        userStore.setState({ ...initialState, currentUser });

        // obtém a url de retorno dos parâmetros de consulta ou padrão para '/'
        const returnUrl = searchParams.get("returnUrl") || "/";
        router.push(returnUrl);
      } catch (error: any) {
        alertService.error(error);
      }
    },
    logout: async () => {
      await fetch.post("/api/account/logout");
      router.push("/account/login");
    },
    register: async (user) => {
      try {
        await fetch.post("/api/account/register", user);
        alertService.success("Cadastro feito com sucesso!", true);
        router.push("/account/login");
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getAll: async () => {
      userStore.setState({ users: await fetch.get("/api/users") });
    },
    getById: async (id) => {
      userStore.setState({ user: undefined });
      try {
        userStore.setState({ user: await fetch.get(`/api/users/${id}`) });
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getCurrent: async () => {
      if (!currentUser) {
        userStore.setState({
          currentUser: await fetch.get("/api/users/current"),
        });
      }
    },
    create: async (user) => {
      await fetch.post("/api/users", user);
    },
    update: async (id, params) => {
      await fetch.put(`/api/users/${id}`, params);

      // atualiza o usuário atual se o usuário atualizar o próprio registro
      if (id === currentUser?.id) {
        userStore.setState({ currentUser: { ...currentUser, ...params } });
      }
    },
    delete: async (id) => {
      // seta isDeleting prop para true no usuário
      userStore.setState({
        users: users!.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        }),
      });

      // deleta o user
      const response = await fetch.delete(`/api/users/${id}`);

      // remove o usuário deleteado do state
      userStore.setState({ users: users!.filter((x) => x.id !== id) });

      // logout se o usuário deletar o próprio registro
      if (response.deletedSelf) {
        router.push("/account/login");
      }
    },
  };
}

// interfaces

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  isDeleting?: boolean;
}

interface IUserStore {
  users?: IUser[];
  user?: IUser;
  currentUser?: IUser;
}

interface IUserService extends IUserStore {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: IUser) => Promise<void>;
  getAll: () => Promise<void>;
  getById: (id: string) => Promise<void>;
  getCurrent: () => Promise<void>;
  create: (user: IUser) => Promise<void>;
  update: (id: string, params: Partial<IUser>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
