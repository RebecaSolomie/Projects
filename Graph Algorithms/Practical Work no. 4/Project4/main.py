from directed_graph import *


class UserInterface:
    def __init__(self):
        self._graphs = []
        self._current = None

    @staticmethod
    def print_menu():
        print("\tMENU\n")
        print("0. EXIT")
        print("1. Read a graph from a file")
        print("2. Write the current graph in a text file")
        print("3. Get the number of vertices")
        print("4. Get the number of edges")
        print("5. Verify if it is a DAG (Directed Acyclic Graph)")
        print("6. Get the highest cost path between two vertices")
        print("7. Count the number of distinct lowest cost paths between two vertices")

    @staticmethod
    def get_user_input():
        return int(input("\tEnter your choice: "))

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

    def verify_dag_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        if self._current.is_directed_acyclic_graph():
            print("The graph is a DAG.")
        else:
            print("The graph is not a DAG.")

    def get_highest_cost_path_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source vertex: "))
        target = int(input("Enter the target vertex: "))
        try:
            cost, path = self._current.get_highest_cost_path(source, target)
            if path is None:
                print("There is no path between the two vertices.")
            else:
                print("The highest cost path is: " + str(cost))
                print("The path is: " + str(path))
        except ValueError as ve:
            print(ve)

    def get_lowest_cost_paths_ui(self):
        if self._current is None:
            print("There is no graph.")
            return
        source = int(input("Enter the source vertex: "))
        target = int(input("Enter the target vertex: "))
        try:
            count, paths = self._current.count_lowest_cost_paths(source, target)
            if count == 0:
                print("There is no path between the two vertices.")
            else:
                print("The number of distinct lowest cost paths is: " + str(count))
                print("The paths are: " + str(paths))
        except ValueError as ve:
            print(ve)

    def run(self):
        while True:
            self.print_menu()
            choice = self.get_user_input()
            if choice == 0:
                break
            if choice == 1:
                self.read_graph_from_file_ui()
            if choice == 2:
                self.write_graph_to_file_ui()
            if choice == 3:
                self.get_number_of_vertices_ui()
            if choice == 4:
                self.get_number_of_edges_ui()
            if choice == 5:
                self.verify_dag_ui()
            if choice == 6:
                self.get_highest_cost_path_ui()
            if choice == 7:
                self.get_lowest_cost_paths_ui()


if __name__ == '__main__':
    ui = UserInterface()
    ui.run()
