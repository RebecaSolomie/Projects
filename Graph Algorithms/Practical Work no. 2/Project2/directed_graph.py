from random import *


def read_graph_from_file(file_name):
    """
    Read a graph from a file
    :param file_name: name of the file
    :return: the read graph
    """
    with open(file_name, "r") as file:
        vertices_number, edges_number = map(int, file.readline().split())
        graph = DirectedGraph(vertices_number, 0)
        for _ in range(edges_number):
            line = file.readline().strip().split()
            source = int(line[0])
            target = int(line[1])
            cost = int(line[2])
            graph.add_edge(source, target, cost)
        return graph


def write_graph_to_file(graph, file_name):
    """
    Write a graph to a file
    :param graph: the graph to be written
    :param file_name: name of the file
    :return: -
    :raises: ValueError if there is nothing that can be written
    """
    file = open(file_name, "w")
    first_line = str(graph.get_number_of_vertices()) + ' ' + str(graph.get_number_of_edges()) + '\n'
    file.write(first_line)
    if len(graph.get_dict_cost()) == 0 and len(graph.get_dict_in()) == 0:
        raise ValueError("There is nothing that can be written!")
    for edge in graph.get_dict_cost().keys():
        new_line = "{} {} {}\n".format(edge[0], edge[1], graph.get_dict_cost()[edge])
        file.write(new_line)
    for vertex in graph.get_dict_in().keys():
        if len(graph.get_dict_in()[vertex]) == 0 and len(graph.get_dict_out()[vertex]) == 0:
            new_line = "{}\n".format(vertex)
            file.write(new_line)
    file.close()


def generate_random_graph(vertices_number, edges_number):
    """
    Generate a random graph
    :param vertices_number: number of vertices
    :param edges_number: number of edges
    :return: the generated graph
    """
    graph = DirectedGraph(vertices_number, 0)
    edges_generated = 0
    while edges_generated < edges_number:
        source = randint(0, vertices_number - 1)
        target = randint(0, vertices_number - 1)
        cost = randint(0, 100)
        if not graph.has_edge(source, target) and source != target:
            graph.add_edge(source, target, cost)
            edges_generated += 1
    return graph


class DirectedGraph:
    def __init__(self, vertices_number, edges_number):
        self._vertices_number = vertices_number
        self._edges_number = edges_number
        self._dict_in = {}
        self._dict_out = {}
        self._dict_cost = {}
        for i in range(vertices_number):
            self._dict_in[i] = []
            self._dict_out[i] = []

    def add_edge(self, source, target, cost):
        """
        Add an edge to the graph
        :param source: the vertex where the edge starts
        :param target: the vertex where the edge ends
        :param cost: the cost of the edge
        :return: True if the edge was added, False otherwise
        """
        if source in self._dict_in[target] or target in self._dict_out[source]:
            return False
        self._dict_in[target].append(source)
        self._dict_out[source].append(target)
        self._dict_cost[(source, target)] = cost
        self._edges_number += 1
        return True

    def has_edge(self, source, target):
        """
        Check if there is an edge between two vertices
        :param source: the vertex where the edge starts
        :param target: the vertex where the edge ends
        :return: True if there is an edge between the two vertices, False otherwise
        Complexity: O(1)
        """
        if (source, target) in self._dict_cost.keys():
            return True
        return False

    def backward_bfs(self, source, target):
        """
        Finds the lowest length path between them, by using a backward breadth-first search from the ending vertex
        :param source: the vertex where the path starts
        :param target: the vertex where the path ends
        :return: the lowest length path between the two vertices
        Complexity: O(V + E) where V is the number of vertices and E is the number of edges
        """
        visited = [False] * self._vertices_number
        visited[target] = True
        queue = [target]
        parent = [-1] * self._vertices_number
        while queue:
            current = queue.pop(0)
            for vertex in self._dict_in[current]:
                if not visited[vertex]:
                    visited[vertex] = True
                    queue.append(vertex)
                    parent[vertex] = current
        path = []
        current = source
        while current != -1:
            path.append(current)
            current = parent[current]
        return path
