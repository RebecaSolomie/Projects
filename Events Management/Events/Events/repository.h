#pragma once
#include <string>
#include <vector>
#include "domain.h"


class Repository
{
private:
	std::vector<Event> admin_events;
	std::string filename;
public:
	explicit Repository(std::vector<Event>& repo, std::string& filename);
	void initializeRepo();

	// adds an event to the repository
	void addEvent(const Event& e);

	// deletes an event from the repository
	void deleteEvent(int index);

	// updates an event from the repository
	void updateEvent(int index, const Event& e);

	// returns an event from the repository by its title
	int findEventByTitle(const std::string& title);

	// returns the events from the repository
	std::vector<Event>& getEvents();

	// returns the number of events from the repository
	int getNumberOfEvents();


	void writeToFile();
	void loadFromFile();

	~Repository();
};


class RepositoryException : public std::exception
{
private:
	std::string message;
public:
	explicit RepositoryException(std::string& message);
	const char* what() const noexcept override;
};
