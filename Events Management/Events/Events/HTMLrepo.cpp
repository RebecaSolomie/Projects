#include "HTMLrepo.h"
#include <fstream>

HTMLRepository::HTMLRepository(std::vector<Event>& user_events, const std::string& userFile)
{
	this->user_events = user_events;
	this->file_name = userFile;
}

std::vector<Event>& HTMLRepository::getUserEvents()
{
	return this->user_events;
}

int HTMLRepository::getNumberOfEvents()
{
	return this->user_events.size();
}

void HTMLRepository::addUserEvent(const Event& event)
{
	this->user_events.push_back(event);
	this->writeToFile();
}

void HTMLRepository::deleteUserEvent(int index)
{
	this->user_events.erase(this->user_events.begin() + index);
	this->writeToFile();
}

void HTMLRepository::writeToFile()
{
	std::ofstream fout(this->file_name);
	fout << "<!DOCTYPE html>\n<html>\n<head>\n<title>Events</title>\n</head>\n<body>\n";
	fout << "<table border=\"1\">\n";
	fout << "<td>Title</td>\n<td>Description</td>\n<td>Date</td>\n<td>Participants</td>\n";
	for (auto& event : this->user_events)
	{
		fout << "<tr>\n";
		fout << "<td>" << event.getTitle() << "</td>\n";
		fout << "<td>" << event.getDescription() << "</td>\n";
		fout << "<td>" << event.getDateAndTime() << "</td>\n";
		fout << "<td>" << event.getPeopleGoing() << "</td>\n";
		fout << "</tr>\n";
	}
	fout << "</table></body></html>";
	fout.close();
}

std::string& HTMLRepository::getFile()
{
	return this->file_name;
}

HTMLRepository::~HTMLRepository() = default;