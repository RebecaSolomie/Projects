#pragma once
#include <string>
#include <vector>
#include <memory>
#include "repository.h"
#include "undoredo.h"


class Controller
{
private:
	Repository& admin_repo;
	std::vector<std::shared_ptr<UndoRedoAction>> undoAdmin;
	std::vector<std::shared_ptr<UndoRedoAction>> redoAdmin;
public:
	explicit Controller(Repository& repo);

	// adds a new event to the repository
	void addEventInController(const Event& e);

	// deletes an event from the repository
	void deleteEventInController(const std::string& title);

	// updates an event from the repository
	void updateEventInController(const std::string& old_title, const std::string& new_title, const std::string& new_description,
		const std::string& new_date_time, int new_peopleGoing, const std::string& new_link);

	// returns the events from the repository
	std::vector<Event> getEventsInController();

	// returns the number of events from the repository
	int getNumberOfEventsInController();

	// return an event by its index
	Event getEventByIndexInController(int index);

	int getEventIndex(const std::string& title);

	Event getEventByTitleInController(const std::string& title);

	// search for an event by month
	std::vector<Event> getEventsByMonthInController(std::string month) const;

	// get number of events searched by month
	int getNumberOfEventsByMonthInController(std::string month) const;


	void undoLastAction();
	void redoLastAction();
	void clearUndoRedo();

	~Controller();
};
