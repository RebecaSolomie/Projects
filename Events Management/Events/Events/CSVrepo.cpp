#include "CSVrepo.h"
#include <fstream>

CSVRepository::CSVRepository(const std::vector<Event>& events, const std::string& userFile)
{
	this->user_events = events;
	this->file_name = userFile;
}

std::vector<Event>& CSVRepository::getUserEvents()
{
	return this->user_events;
}

int CSVRepository::getNumberOfEvents()
{
	return this->user_events.size();
}

void CSVRepository::addUserEvent(const Event& event)
{
	this->user_events.push_back(event);
	this->writeToFile();
}

void CSVRepository::deleteUserEvent(int index)
{
	this->user_events.erase(this->user_events.begin() + index);
	this->writeToFile();
}

void CSVRepository::writeToFile()
{
	std::ofstream fout(this->file_name);
	if (!this->user_events.empty())
	{
		for (const auto& event : this->user_events)
		{
			fout << event.getTitle() << "," << event.getDescription() << "," << event.getDateAndTime() << "," << event.getLink() << "\n";
		}
	}
	fout.close();
}

std::string& CSVRepository::getFile()
{
	return this->file_name;
}

CSVRepository::~CSVRepository() = default;