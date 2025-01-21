import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

interface RsvpForm {
  name: string;
  email: string;
  attending: boolean;
  dietaryRestrictions: string;
}

function App() {
  const [form, setForm] = useState<RsvpForm>({
    name: '',
    email: '',
    attending: false,
    dietaryRestrictions: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('guests').upsert({
        name: form.name,
        email: form.email,
        attending: form.attending,
        dietary_restrictions: form.dietaryRestrictions,
      });

      if (error) throw error;

      toast.success('RSVP submitted successfully!');
      setForm({
        name: '',
        email: '',
        attending: false,
        dietaryRestrictions: '',
      });
    } catch (error) {
      toast.error('Error submitting RSVP. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#829f89] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Michelle y Eric RSVP
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="attending"
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              checked={form.attending}
              onChange={(e) =>
                setForm({ ...form, attending: e.target.checked })
              }
            />
            <label
              htmlFor="attending"
              className="ml-2 block text-sm text-gray-700"
            >
              Confirmo Asistencia
            </label>
          </div>

          <div>
            <label
              htmlFor="dietary"
              className="block text-sm font-medium text-gray-700"
            >
              Restricciones Alimenticias
            </label>
            <textarea
              id="dietary"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              value={form.dietaryRestrictions}
              onChange={(e) =>
                setForm({ ...form, dietaryRestrictions: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Submit RSVP
          </button>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
