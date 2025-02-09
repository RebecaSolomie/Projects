from directed_graph import *


class UserInterface:
    def __init__(self):
        self._graphs = []
        self._current = None

    @staticmethod
    def print_menu():
        print("\tMENU\n")
        print("0. EXIT")
        print("1. Create a random graph with a given number of vertices and edges")
        print("2. Read a graph from a file")
        print("3. Write the current graph in a text file")
        print("4. Switch the current graph")
        print("5. Get the number of vertices")
        print("6. Get the number of edges")
        print("7. Parse the set of vertices")
        print("8. Get the in degree of a vertex")
        print("9. Get the out degree of a vertex")
        print("10. Get the inbound edges of a vertex")
        print("11. Get the outbound edges of a vertex")
        print("12. Check if there is an edge between two vertices")
        print("13. Retrieve the cost of an edge")
        print("14. Add a vertex")
        print("15. Remove a vertex")
        print("16. Add an edge")
        print("17. Remove an edge")
        print("18. Make a copy")
        print("19. Find the lowest cost path between two vertices using backwards Dijkstra's algorithm")

    @staticmethod
    def get_user_input():
        return int(input("\tEnter your choice: "))

    def create_random_graph_ui(self):
        vertices_number = int(input("Enter the number of vertices: "))
        edges_number = int(input("Enter the number of edges: "))
        self._graphs.append(generate_random_graph(vertices_number, edges_number))
        self._current = self._graphs[-1]

    def read_graph_from_file_ui(self):
        file_name = input("Enter the file name: ")
        try:
            self._graphs.append(read_graph_from_file(file_name))
            self._current = self._graphs[-1]
        except FileNotFoundError:
            print("The file was not found.")

    def write_graph_to_file_ui(self):
        file_name = input("Enter the file name: ")
        try:
            write_graph_to_file(self._current, file_name)
        except FileNotFoundError:
            print("The file was not found.")

    def switch_graph_ui(self):
        if not self._graphs:
            print("No graphs available.")
            return
        print("Available graphs:")
        for index, graph in enumerate(self._graphs):
            print(f"{index}. {graph}")
        index = int(input("Enter the graph index: "))
        if 0 <= index < len(self._graphs):
            self._current = self._graphs[index]
        else:
            print("Invalid index. Please choose a valid index.")

    def get_number_of_vertices_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        print("The number of vertices is: " + str(self._current.get_number_of_vertices()))

    def get_number_of_edges_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        print("The number of edges is: " + str(self._current.get_number_of_edges()))

    def parse_vertices_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        for vertex in self._current.parse_vertices():
            print("{}".format(vertex))

    def get_in_degree_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        vertex = int(input("Enter the vertex: "))
        print("The in degree of the vertex is: " + str(self._current.get_in_degree(vertex)))

    def get_out_degree_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        vertex = int(input("Enter the vertex: "))
        print("The out degree of the vertex is: " + str(self._current.get_out_degree(vertex)))

    def parse_inbound_edges_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        vertex = int(input("Enter the vertex: "))
        print("The inbound edges of the vertex are:")
        for edge in self._current.parse_inbound_edges(vertex):
            print("{}".format(edge))

    def parse_outbound_edges_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        vertex = int(input("Enter the vertex: "))
        print("The outbound edges of the vertex are:")
        for edge in self._current.parse_outbound_edges(vertex):
            print("{}".format(edge))

    def get_endpoints_ui(self):
        source = int(input("Enter the source: "))
        target = int(input("Enter the target: "))
        print(self._current.get_endpoints(source, target))

    def has_edge_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source: "))
        target = int(input("Enter the target: "))
        if self._current.has_edge(source, target):
            print("There is an edge between the two vertices.")
        else:
            print("There is no edge between the two vertices.")

    def set_edge_cost_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source: "))
        target = int(input("Enter the target: "))
        cost = int(input("Enter the cost: "))
        if self._current.has_edge(source, target):
            self._current.set_cost(source, target, cost)
            print("The cost was set.")
        else:
            print("There is no edge between the two vertices.")

    def add_vertex_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        vertex = int(input("Enter the vertex: "))
        if self._current.add_vertex(vertex):
            print("The vertex was added successfully.")
        else:
            print("The vertex already exists.")

    def remove_vertex_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        vertex = int(input("Enter the vertex: "))
        if self._current.remove_vertex(vertex):
            print("The vertex was removed successfully.")
        else:
            print("The vertex does not exist.")

    def add_edge_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source: "))
        target = int(input("Enter the target: "))
        cost = int(input("Enter the cost: "))
        if self._current.add_edge(source, target, cost):
            print("The edge was added successfully.")
        else:
            print("The edge already exists.")

    def remove_edge_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source: "))
        target = int(input("Enter the target: "))
        if self._current.remove_edge(source, target):
            print("The edge was removed successfully.")
        else:
            print("The edge does not exist.")

    def make_copy_ui(self):
        if self._current is None:
            print("There is no graph to copy.")
            return
        self._graphs.append(self._current.make_copy())
        self._current = self._graphs[-1]
        if self._current is not None:
            print("The copy was made successfully.")
        else:
            print("The copy could not be made.")

    def backwards_dijkstra_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source: "))
        target = int(input("Enter the target: "))
        cost, path = self._current.backwards_dijkstra(source, target)
        if path is None:
            print("There is no path between the two vertices.")
        else:
            print("The cost is: {}".format(cost))
            print("The lowest cost path is:")
            for vertex in path:
                print("{}".format(vertex))

    def run(self):
        while True:
            self.print_menu()
            option = self.get_user_input()
            if option == 0:
                print("Exiting the program...")
                break
            elif option == 1:
                self.create_random_graph_ui()
            elif option == 2:
                self.read_graph_from_file_ui()
            elif option == 3:
                self.write_graph_to_file_ui()
            elif option == 4:
                self.switch_graph_ui()
            elif option == 5:
                self.get_number_of_vertices_ui()
            elif option == 6:
                self.get_number_of_edges_ui()
            elif option == 7:
                self.parse_vertices_ui()
            elif option == 8:
                self.get_in_degree_ui()
            elif option == 9:
                self.get_out_degree_ui()
            elif option == 10:
                self.parse_inbound_edges_ui()
            elif option == 11:
                self.parse_outbound_edges_ui()
            elif option == 12:
                self.has_edge_ui()
            elif option == 13:
                self.set_edge_cost_ui()
            elif option == 14:
                self.add_vertex_ui()
            elif option == 15:
                self.remove_vertex_ui()
            elif option == 16:
                self.add_edge_ui()
            elif option == 17:
                self.remove_edge_ui()
            elif option == 18:
                self.make_copy_ui()
            elif option == 19:
                self.backwards_dijkstra_ui()


if __name__ == "__main__":
    ui = UserInterface()
    ui.run()
