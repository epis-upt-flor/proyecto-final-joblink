import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginTabs() {
  return (
    <Tabs defaultValue="admin" className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="admin">Administrador</TabsTrigger>
        <TabsTrigger value="empresa">Empresa</TabsTrigger>
      </TabsList>

      {/* Administrador */}
      <TabsContent value="admin">
        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Accede como administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm role="admin" />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Empresa */}
      <TabsContent value="empresa">
        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Accede como empresa </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm role="empresa" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
