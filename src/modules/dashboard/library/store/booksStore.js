import { defineStore } from "pinia"
import { ref, computed } from "vue"

const initialBooks = [
  {
    id: 1,
    title: "Cien años de soledad",
    description:
      "Una novela del escritor colombiano Gabriel García Márquez que narra la historia de la familia Buendía a lo largo de varias generaciones en el pueblo ficticio de Macondo.",
    author: "Gabriel García Márquez",
    genre: "Realismo mágico",
    category: "Novela",
    publishedDate: "1967-05-30",
    status: 1,
    cover: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
  },
  {
    id: 2,
    title: "Don Quijote de la Mancha",
    description:
      "Una novela escrita por Miguel de Cervantes Saavedra que sigue las aventuras del ingenioso hidalgo Don Quijote y su fiel escudero Sancho Panza en su búsqueda de justicia y aventuras.",
    author: "Miguel de Cervantes Saavedra",
    genre: "Novela",
    category: "Novela",
    publishedDate: "1605-01-16",
    status: 1,
    cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    id: 3,
    title: "La sombra del viento",
    description:
      "Una novela del escritor español Carlos Ruiz Zafón que sigue la historia de un joven llamado Daniel Sempere, quien descubre un libro olvidado en el Cementerio de los Libros Olvidados y se ve envuelto en una trama de misterio y secretos.",
    author: "Carlos Ruiz Zafón",
    genre: "Novela",
    category: "Novela",
    publishedDate: "2001-04-12",
    status: 1,
    cover: "https://covers.openlibrary.org/b/id/8231857-L.jpg",
  },
  {
    id: 4,
    title: "El amor en los tiempos del cólera",
    description:
      "Una novela del escritor colombiano Gabriel García Márquez que narra la historia de amor entre Florentino Ariza y Fermina Daza a lo largo de varias décadas, explorando temas como el amor, la pasión y la vejez.",
    author: "Gabriel García Márquez",
    genre: "Novela",
    category: "Novela",
    publishedDate: "1985-09-05",
    status: 1,
    cover: "https://covers.openlibrary.org/b/id/8231858-L.jpg",
  },
  {
    id: 5,
    title: "Terror in Texas",
    description:
      "Una novela de terror ambientada en Texas, donde los personajes enfrentan situaciones aterradoras y sobrenaturales.",
    author: "Autor Desconocido",
    genre: "Terror",
    category: "Terror",
    publishedDate: "2020-10-31",
    status: 1,
    cover: "https://covers.openlibrary.org/b/id/8231859-L.jpg",
  },
]

export const useBooksStore = defineStore("books", () => {
  const books = ref([...initialBooks])

  const allBooks = computed(() => books.value)
  const activeBooks = computed(() => books.value.filter((book) => book.status === 1))

  const addBook = (book) => {
    const newId = Math.max(...books.value.map((b) => b.id), 0) + 1
    books.value.push({ ...book, id: newId })
  }

  const updateBook = (id, updatedBook) => {
    const index = books.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      books.value[index] = { ...books.value[index], ...updatedBook }
    }
  }

  const deleteBook = (id) => {
    const index = books.value.findIndex((b) => b.id === id)
    if (index !== -1) {
      books.value.splice(index, 1)
    }
  }

  const getBookById = (id) => {
    return books.value.find((b) => b.id === id)
  }

  return {
    books,
    allBooks,
    activeBooks,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
  }
})
