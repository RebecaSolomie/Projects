def read_graph_from_file(filename):
    with open(filename) as file:
        num_vertices = int(file.readline())
        graph = [[False for _ in range(num_vertices)] for _ in range(num_vertices)]
        for line in file:
            i, j = map(int, line.split())
            graph[i][j] = graph[j][i] = True  # create an undirected graph by adjacency matrix
    return graph


class UndirectedGraph:
    def __init__(self, graph):
        self.graph = graph
        self.num_vertices = len(graph)
        self.max_clique = []

    def find_max_clique(self, potential_clique, remaining_vertices, skip_vertices):
        """
        Find the maximum clique in the graph
        :param potential_clique: list of vertices in the potential clique
        :param remaining_vertices: list of vertices that can be added to the potential clique
        :param skip_vertices: list of vertices that should be skipped to avoid redundant checks
        :return: -
        """
        if not remaining_vertices and not skip_vertices:  # no more vertices to consider adding or skipping
            if len(potential_clique) > len(self.max_clique):  # update the maximum clique
                self.max_clique = potential_clique[:]
            return
        for vertex in remaining_vertices[:]:  # iterate through each vertex in the remaining vertices
            new_potential_clique = potential_clique + [vertex]  # add the vertex to the potential clique
            new_remaining_vertices = [v for v in remaining_vertices if self.graph[vertex][v]]  # include only the
            # vertices that are connected to the current vertex
            new_skip_vertices = [v for v in skip_vertices if self.graph[vertex][v]]
            # recursively call the function with the new potential clique, remaining vertices, and skip vertices
            self.find_max_clique(new_potential_clique, new_remaining_vertices, new_skip_vertices)
            # update the remaining vertices and skip vertices
            remaining_vertices.remove(vertex)
            skip_vertices.append(vertex)

    def get_max_clique(self):
        vertices = list(range(self.num_vertices))  # create a list of vertices
        self.find_max_clique([], vertices, [])  # call the recursive function to find the clique
        return self.max_clique
