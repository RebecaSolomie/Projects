from undirected_graph import *


class UserInterface:
    def __init__(self):
        self.graph = None

    def read_graph_from_file_ui(self):
        filename = input("Enter the filename: ")
        self.graph = read_graph_from_file(filename)

    def print_max_clique_ui(self):
        if not self.graph:
            print("No graph read.")
            return
        graph = UndirectedGraph(self.graph)
        max_clique = graph.get_max_clique()
        if not max_clique:
            print("No cliques found.")
        else:
            print("Maximum clique:", max_clique)

    def run(self):
        while True:
            print("\n\tMENU\n")
            print("0. EXIT")
            print("1. Read graph from file")
            print("2. Print maximum clique")
            option = int(input("Enter an option: "))
            if option == 0:
                break
            elif option == 1:
                self.read_graph_from_file_ui()
            elif option == 2:
                self.print_max_clique_ui()
            else:
                print("Invalid option.")


if __name__ == "__main__":
    ui = UserInterface()
    ui.run()
