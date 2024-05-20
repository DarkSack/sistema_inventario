export default async function handler() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res
        .status(400)
        .json({ message: "Ha ocurrido un error al cerrar sesión" });
    }
    localStorage.clear();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
