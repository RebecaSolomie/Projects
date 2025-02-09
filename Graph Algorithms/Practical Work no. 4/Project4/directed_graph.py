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

    def get_number_of_vertices(self):
        """
        Get the number of vertices in the graph
        :return: the number of vertices
        """
        return self._vertices_number

    def get_number_of_edges(self):
        """
        Get the number of edges in the graph
        :return: the number of edges
        """
        return self._edges_number

    def get_dict_in(self):
        """
        Get the dictionary of inbound edges
        :return: the dictionary of inbound edges
        """
        return self._dict_in

    def get_dict_out(self):
        """
        Get the dictionary of outbound edges
        :return: the dictionary of outbound edges
        """
        return self._dict_out

    def get_dict_cost(self):
        """
        Get the dictionary of costs
        :return: the dictionary of costs
        """
        return self._dict_cost

    def tarjan_scc_util(self, u, low, disc, stack_member, st, time):
        """
        Utility function for Tarjan's algorithm
        :param u: the current vertex
        :param low: the lowest discovery time reachable from the current vertex
        :param disc: the discovery time of the current vertex
        :param stack_member: array to check if a vertex is in the stack
        :param st: stack to store the vertices of the current path
        :param time: list to track the current time
        :return: True if no cycles are found, False otherwise
        """
        disc[u] = low[u] = time[0]  # initialize discovery time and low value
        time[0] += 1
        st.append(u)
        stack_member[u] = True
        for v in self._dict_out[u]:  # explore adjacent vertices
            if disc[v] == -1:
                if not self.tarjan_scc_util(v, low, disc, stack_member, st, time):
                    return False
                low[u] = min(low[u], low[v])  # update low value of u
            elif stack_member[v]:
                low[u] = min(low[u], disc[v])
        w = -1
        if low[u] == disc[u]:  # identify the strongly connected component
            scc = []
            while w != u:
                w = st.pop()
                scc.append(w)
                stack_member[w] = False
            if len(scc) > 1:
                return False
        return True

    def is_directed_acyclic_graph(self):
        """
        Check if the graph is a directed acyclic graph
        :return: True if the graph is a directed acyclic graph, False otherwise
        """
        disc = [-1] * self._vertices_number
        low = [-1] * self._vertices_number
        stack_member = [False] * self._vertices_number
        st = []
        for i in range(self._vertices_number):
            if disc[i] == -1:
                if not self.tarjan_scc_util(i, low, disc, stack_member, st, [0]):
                    return False
        return True

    def topological_sort_util(self, v, visited, stack):
        """
        Utility function for topological sort
        :param v: the current vertex
        :param visited: array to check if a vertex was visited
        :param stack: stack to store the vertices in topological order
        :return: -
        """
        visited[v] = True
        for i in self._dict_out[v]:
            if not visited[i]:
                self.topological_sort_util(i, visited, stack)  # recursively visit the adjacent vertices
        stack.append(v)  # add to the stack

    def topological_sort(self):
        """
        Topological sort of the graph
        :return: the topological order of the vertices
        """
        visited = [False] * self._vertices_number  # array to check if a vertex was visited
        stack = []  # stack to store the vertices
        for i in range(self._vertices_number):
            if not visited[i]:
                self.topological_sort_util(i, visited, stack)
        return stack[::-1]  # return the stack in reverse order

    def get_highest_cost_path(self, source, target):
        """
        Get the highest cost path between two vertices
        :param source: the source vertex
        :param target: the target vertex
        :return: the highest cost path between the two vertices and the path itself or None if there is no path
        :raises: ValueError if the graph is not a directed acyclic graph
        """
        if not self.is_directed_acyclic_graph():
            raise ValueError("The graph is not a directed acyclic graph!")
        stack = self.topological_sort()
        distances = [-float("inf")] * self._vertices_number
        predecessors = [-1] * self._vertices_number
        distances[source] = 0
        for u in stack:  # visit all the vertices in topological order
            if distances[u] != -float("inf"):
                for v in self._dict_out[u]:  # iterates over the outgoing edges from each vertex
                    if distances[v] < distances[u] + self._dict_cost[(u, v)]:
                        distances[v] = distances[u] + self._dict_cost[(u, v)]
                        predecessors[v] = u
        if distances[target] == -float("inf"):
            return None, None
        path = []  # reconstruct the path
        current = target
        while current != -1:
            path.append(current)
            current = predecessors[current]
        path.reverse()
        return distances[target], path
    # complexity: O(V + E) because we use a topological sort to visit all the vertices, then we visit all the edges
    # and each edge and vertex is processed exactly once

    def count_lowest_cost_paths(self, source, target):
        """
        Count the number of distinct lowest cost paths between two vertices and return the paths
        :param source: the source vertex
        :param target: the target vertex
        :return: the number of distinct lowest cost paths between the two vertices and the paths themselves
        :raises: ValueError if the graph is not a directed acyclic graph
        """
        if not self.is_directed_acyclic_graph():
            raise ValueError("The graph is not a directed acyclic graph!")
        stack = self.topological_sort()
        distances = [float("inf")] * self._vertices_number  # distance from source to vertex
        path_counts = [0] * self._vertices_number  # number of paths from source to vertex
        predecessors = [[] for _ in range(self._vertices_number)]  # predecessors of a vertex
        distances[source] = 0
        path_counts[source] = 1
        for u in stack:  # iterates over each vertex in the topological order
            if distances[u] != float("inf"):
                for v in self._dict_out[u]:  # iterates over the outgoing edges from each vertex
                    if distances[v] > distances[u] + self._dict_cost[(u, v)]:
                        distances[v] = distances[u] + self._dict_cost[(u, v)]
                        path_counts[v] = path_counts[u]
                        predecessors[v] = [u]
                    elif distances[v] == distances[u] + self._dict_cost[(u, v)]:
                        path_counts[v] += path_counts[u]
                        predecessors[v].append(u)
        if distances[target] == float("inf"):
            return 0, []
        all_paths = []  # reconstruct all paths
        stack = [(target, [target])]
        while stack:
            current, path = stack.pop()
            if current == source:
                all_paths.append(path[::-1])
            else:
                for pred in predecessors[current]:
                    stack.append((pred, path + [pred]))
        return path_counts[target], all_paths
    # complexity: O(V + E) because we use a topological sort to visit all the vertices, then we visit all the edges
    # and each edge and vertex is processed exactly once
