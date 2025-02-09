from directed_graph import *


class UserInterface:
    def __init__(self):
        self._graphs = []
        self._current = None

    @staticmethod
    def print_menu():
        print("\tMENU\n")
        print("1. Generate a random graph")
        print("2. Read a graph from a file")
        print("3. Write the current graph in a text file")
        print("4. Find the lowest length path between two vertices")
        print("0. EXIT")

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

    def find_lowest_length_path_ui(self):
        source = int(input("Enter the source vertex: "))
        target = int(input("Enter the target vertex: "))
        print(self._current.backward_bfs(source, target))

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
                self.find_lowest_length_path_ui()


if __name__ == "__main__":
    ui = UserInterface()
    ui.run()
