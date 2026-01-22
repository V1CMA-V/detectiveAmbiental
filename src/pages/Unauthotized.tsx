export default function Unauthotized() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold">Acceso no autorizado</h1>
      <p className="mb-8 text-lg">
        No tienes permiso para acceder a esta página. Por favor, inicia sesión
        con una cuenta autorizada.
      </p>
    </div>
  )
}
