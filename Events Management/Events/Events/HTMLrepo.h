#pragma once
#include "user_repo.h"


class HTMLRepository : public UserRepository {
public:
	HTMLRepository(std::vector<Event>& user_events, const std::string& userFile);

	std::vector<Event>& getUserEvents() override;
	int getNumberOfEvents() override;

	void addUserEvent(const Event& event) override;
	void deleteUserEvent(int index) override;

	void writeToFile() override;
	std::string& getFile() override;

	~HTMLRepository();
};