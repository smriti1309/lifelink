'use client';

import * as React from 'react';
import { Search, AlertCircle, Info } from 'lucide-react';
import { STATES, getDistrictsForState } from '@/lib/constants/locations';
import { BLOOD_TYPE_LABELS } from '@/lib/constants/bloodTypes';
import { searchCompatibleDonors } from '@/app/actions/donor';
import { DonorCard } from './donor-card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BloodType, DonorStatus, ContactPreference } from '@prisma/client';

interface MatchingDonor {
  id: string;
  fullName: string;
  bloodType: BloodType;
  state: string;
  district: string;
  status: DonorStatus;
  preferredContact: ContactPreference;
}

export function FindDonorsClient() {
  const [bloodType, setBloodType] = React.useState<string>('');
  const [state, setState] = React.useState<string>('');
  const [district, setDistrict] = React.useState<string>('');
  const [availableOnly, setAvailableOnly] = React.useState(true);
  const [eligibleOnly, setEligibleOnly] = React.useState(true);

  const [donors, setDonors] = React.useState<MatchingDonor[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchTriggered, setSearchTriggered] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleStateChange = (val: string) => {
    setState(val);
    setDistrict('');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodType || !state || !district) {
      setErrorMsg('Please select Blood Group, State, and District.');
      return;
    }

    setErrorMsg(null);
    setIsSearching(true);
    setSearchTriggered(true);

    try {
      const response = await searchCompatibleDonors({
        bloodType: bloodType as BloodType,
        state,
        district,
        availableOnly,
        eligibleOnly,
      });

      if (response.success) {
        setDonors(response.donors);
      } else {
        setErrorMsg(response.error || 'Failed to execute donor search.');
        setDonors([]);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
      setDonors([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search Filters Card */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border/40 shadow-premium">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Select
              id="bloodType"
              label="Patient's Blood Group"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              options={Object.keys(BLOOD_TYPE_LABELS).map((bt) => ({
                label: BLOOD_TYPE_LABELS[bt as BloodType],
                value: bt,
              }))}
              placeholder="Select Blood Group"
            />

            <Select
              id="state"
              label="State"
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              options={STATES.map((s) => ({ label: s, value: s }))}
              placeholder="Select State"
            />

            <Select
              id="district"
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
              options={state ? getDistrictsForState(state).map((d) => ({ label: d, value: d })) : []}
              placeholder="Select District"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/20">
            <div className="flex flex-wrap gap-6 text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                />
                <span>Available Donors Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={eligibleOnly}
                  onChange={(e) => setEligibleOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary/20"
                />
                <span>Medically Eligible Donors Only</span>
              </label>
            </div>

            <Button
              type="submit"
              className="px-6 h-10 w-full md:w-auto flex items-center justify-center gap-2"
              isLoading={isSearching}
            >
              <Search className="w-4 h-4" />
              <span>Search Donors</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Error Output */}
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Results */}
      {searchTriggered && !isSearching && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            Search Results ({donors.length})
          </h2>

          {donors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {donors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  fullName={donor.fullName}
                  bloodType={donor.bloodType}
                  state={donor.state}
                  district={donor.district}
                  status={donor.status}
                  preferredContact={donor.preferredContact}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl max-w-xl mx-auto flex flex-col items-center gap-3">
              <div className="p-3 bg-muted/65 rounded-full text-muted-foreground">
                <Info className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-foreground">No matching donors found</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                No compatible donors are currently registered in the selected location. 
                If you are facing a medical emergency, please file an Emergency Blood Request to coordinate donations.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
