import copy
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

    def add_vertex(self, vertex):
        """
        Add a vertex to the graph
        :param vertex: the vertex to be added (integer)
        :return: True if the vertex was added, False otherwise
        """
        if vertex in self._dict_in.keys() and vertex in self._dict_out.keys():
            return False
        self._dict_in[vertex] = []
        self._dict_out[vertex] = []
        self._vertices_number += 1
        return True

    def remove_vertex(self, vertex):
        """
        Remove a vertex from the graph
        :param vertex: the vertex to be removed (integer)
        :return: True if the vertex was removed, False otherwise
        """
        if vertex not in self._dict_in.keys() and vertex not in self._dict_out.keys():
            return False
        self._dict_in.pop(vertex)
        self._dict_out.pop(vertex)
        for key in self._dict_in.keys():
            if vertex in self._dict_in[key]:
                self._dict_in[key].remove(vertex)
            elif vertex in self._dict_out[key]:
                self._dict_out[key].remove(vertex)
        keys = list(self._dict_cost.keys())
        for key in keys:
            if key[0] == vertex or key[1] == vertex:
                self._dict_cost.pop(key)
                self._edges_number -= 1
        self._vertices_number -= 1
        return True

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

    def remove_edge(self, source, target):
        """
        Remove an edge from the graph
        :param source: the vertex where the edge starts
        :param target: the vertex where the edge ends
        :return: True if the edge was removed, False otherwise
        """
        if source not in self._dict_in[target] or target not in self._dict_out[source]:
            return False
        self._dict_in[target].remove(source)
        self._dict_out[source].remove(target)
        del self._dict_cost[(source, target)]
        self._edges_number -= 1
        return True

    def get_dict_in(self):
        """
        Getter for the dictionary of inbound edges
        :return: the dictionary of inbound edges
        """
        return self._dict_in

    def get_dict_out(self):
        """
        Getter for the dictionary of outbound edges
        :return: the dictionary of outbound edges
        """
        return self._dict_out

    def get_dict_cost(self):
        """
        Getter for the dictionary of costs
        :return: the dictionary of costs
        """
        return self._dict_cost

    def get_number_of_vertices(self):
        """
        Getter for the number of vertices
        :return: the number of vertices
        """
        return self._vertices_number

    def get_number_of_edges(self):
        """
        Getter for the number of edges
        :return: the number of edges
        """
        return self._edges_number

    def get_in_degree(self, vertex):
        """
        Get the in degree of a vertex
        :param vertex: the vertex (integer)
        :return: the in degree of the vertex
        Complexity: O(1)
        """
        return len(self._dict_in[vertex])

    def get_out_degree(self, vertex):
        """
        Get the out degree of a vertex
        :param vertex: the vertex (integer)
        :return: the out degree of the vertex
        Complexity: O(1)
        """
        return len(self._dict_out[vertex])

    def get_inbound_edges(self, vertex):
        """
        Get the inbound edges of a vertex
        :param vertex: the vertex (integer)
        :return: the inbound edges of the vertex
        """
        return self._dict_in[vertex]

    def get_outbound_edges(self, vertex):
        """
        Get the outbound edges of a vertex
        :param vertex: the vertex (integer)
        :return: the outbound edges of the vertex
        """
        return self._dict_out[vertex]

    def get_endpoints(self, source, target):
        """
        Get the endpoints of an edge
        :param source: the vertex where the edge starts
        :param target: the vertex where the edge ends
        :return: the endpoints of the edge
        """
        return self._dict_cost[(source, target)]

    def parse_vertices(self):
        """
        Parse the vertices of the graph
        :return: generator for the vertices
        """
        vertices = list(self._dict_in.keys())
        for vertex in vertices:
            yield vertex

    def parse_inbound_edges(self, vertex):
        """
        Parse the inbound edges of a vertex
        :param vertex: the vertex (integer)
        :return: generator for the inbound edges
        """
        for v in self._dict_in[vertex]:
            yield v

    def parse_outbound_edges(self, vertex):
        """
        Parse the outbound edges of a vertex
        :param vertex: the vertex (integer)
        :return: generator for the outbound edges
        """
        for v in self._dict_out[vertex]:
            yield v

    def parse_cost(self):
        """
        Parse the costs of the edges
        :return: generator for the costs
        """
        keys = self._dict_cost.keys()
        for key in keys:
            yield key

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

    def set_cost(self, source, target, cost):
        """
        Set the cost of an edge
        :param source: the vertex where the edge starts
        :param target: the vertex where the edge ends
        :param cost: the new cost of the edge
        :return: -
        """
        self._dict_cost[(source, target)] = cost

    def make_copy(self):
        """
        Make a copy of the graph
        :return: the copy of the graph
        """
        if self is None:
            return None
        new_graph = DirectedGraph(self._vertices_number, self._edges_number)
        new_graph._dict_in = copy.deepcopy(self._dict_in)
        new_graph._dict_out = copy.deepcopy(self._dict_out)
        new_graph._dict_cost = copy.deepcopy(self._dict_cost)
        return new_graph
